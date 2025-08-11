import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi klien Google Gemini
const AI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Log input untuk debugging
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("User Info:", { userId, plan, free_usage });

    // Cek limit penggunaan untuk pengguna non-premium
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached, please upgrade to premium.",
      });
    }

    // Validasi length
    let maxTokens;
    if (typeof length === "object" && length !== null && "length" in length) {
      maxTokens = parseInt(length.length, 10); // Ambil length.length dari objek
    } else {
      maxTokens = parseInt(length, 10); // Langsung parse jika length adalah angka atau string
    }

    if (isNaN(maxTokens) || maxTokens <= 0) {
      return res.json({
        success: false,
        message: "Invalid length value. Please provide a positive integer.",
      });
    }

    console.log("Validated maxTokens:", maxTokens);

    // Inisialisasi model Gemini
    const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Buat artikel dari prompt menggunakan AI
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `System: You are a helpful assistant.\nUser: ${prompt}` }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
      },
    });

    const content = result.response.text();
    console.log("Gemini API Response:", content.substring(0, 100) + "..."); // Log sebagian respons untuk debugging

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Update penggunaan untuk user non-premium
    if (plan !== "premium") {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 },
        });
        console.log("Clerk metadata updated");
      } catch (clerkError) {
        console.error("Clerk Error:", JSON.stringify(clerkError, null, 2));
        throw new Error("Failed to update Clerk metadata: " + clerkError.message);
      }
    }

    // Kirim respons berhasil
    return res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateArticle:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Log input untuk debugging
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached, please upgrade to premium.",
      });
    }

    // Inisialisasi model Gemini
    const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Buat judul blog
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `System: You are a helpful assistant.\nUser: ${prompt}` }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const content = result.response.text();
    console.log("Gemini API Response:", content.substring(0, 100) + "...");

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Update penggunaan untuk user non-premium
    if (plan !== "premium") {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 },
        });
        console.log("Clerk metadata updated");
      } catch (clerkError) {
        console.error("Clerk Error:", JSON.stringify(clerkError, null, 2));
        throw new Error("Failed to update Clerk metadata: " + clerkError.message);
      }
    }

    // Kirim respons berhasil
    return res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateBlogTitle:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "only available for premium.",
      });
    }

    const form = new FormData();
    form.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type, publish)
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Kirim respons berhasil
    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Error in generateImage:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    console.log("Image File:", JSON.stringify(image, null, 2));

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "only available for premium.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Kirim respons berhasil
    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Error in removeImageBackground:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Image File:", JSON.stringify(image, null, 2));

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "only available for premium.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Kirim respons berhasil
    return res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Error in removeImageObject:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    // Log input untuk debugging
    console.log("Resume File:", JSON.stringify(resume, null, 2));
    console.log("User Info:", { userId, plan });

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "only available for premium.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "Only allowed 5 mb" });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume content:\n\n${pdfData.text}`;

    // Inisialisasi model Gemini
    const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Review resume
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const content = result.response.text();
    console.log("Gemini API Response:", content.substring(0, 100) + "...");

    // Simpan hasil ke database
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
      `;
      console.log("Database insert successful");
    } catch (dbError) {
      console.error("Database Error:", JSON.stringify(dbError, null, 2));
      throw new Error("Failed to save to database: " + dbError.message);
    }

    // Kirim respons berhasil
    return res.json({ success: true, content });
  } catch (error) {
    console.error("Error in resumeReview:", JSON.stringify(error, null, 2));
    return res.json({ success: false, message: error.message });
  }
};
