import userMlodel from "../model/userMlodel.js";

export const getPendingEducators = async (req, res) => {
    try {
        const pending = await userMlodel.find({
            role: "educator",
            approvalStatus: "pending" // 👈 Fixed the capital 'S'
        }).select("-password");

        return res.status(200).json({
            success: true,
            data: pending
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateEducatorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
                success: false
            });
        }

        // We use findByIdAndUpdate to be more concise and dynamic
        const user = await userMlodel.findByIdAndUpdate(
            id,
            { 
                approvalStatus: status, 
                isActive: status === "approved" 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "Educator not found",
                success: false
            });
        }

        return res.status(200).json({
            message: `Educator ${status} successfully`,
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};