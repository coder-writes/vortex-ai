import sql from "../configs/db.js";

export const getPublishedCreations = async (req,res) => {
    try {

        const creations = await sql`select * from creations where publish = true order by created_at desc`;
        res.json({success: true, creations});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export const toggleLikeCreation = async (req,res) => {
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const [creation] = await sql`select * from creations where id = ${id}`;

        if (!creation) {
            return res.json({success: false, message: "Creation not found"})
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;
        
        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter(() => {
                user !== userIdStr
                message = 'creation unliked'
            })
        } else {
            updatedLikes =  [...currentLikes, userIdStr];
            message = 'creation liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

        await sql `update creations set likes = ${formattedArray}::text[] where id = ${id}`;
        res.json({success: true, message});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserCreations = async (req,res) => {
    try {
        const {userId} = req.auth()

        const creations = await sql`select * from creations where user_id = ${userId} order by created_at desc`;
        res.json({success: true, creations});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}