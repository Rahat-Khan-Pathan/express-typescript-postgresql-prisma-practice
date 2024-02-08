import { Router, Request, Response } from "express";
import prisma from "../services/db";
import { parse } from "dotenv";
const StudentRouter = Router();
// Read
StudentRouter.get("/all_students", async (req: Request, res: Response) => {
    try {
        const allStudents = await prisma.student.findMany();
        res.status(200).json({
            data: allStudents,
            message: "Students loaded successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Couldn't get students. Server error.",
        });
    }
});

// Create
StudentRouter.post("/add_student", async (req: Request, res: Response) => {
    const { name, roll } = req.body;
    try {
        const findStudent = await prisma.student.findUnique({
            where: {
                roll: roll,
            },
        });
        if (findStudent) {
            res.status(400).send("Roll already taken.");
        } else {
            try {
                const newStudent = await prisma.student.create({
                    data: {
                        name: name,
                        roll: roll,
                    },
                });
                res.status(200).json({
                    data: newStudent,
                    message: "Student inserted successfully.",
                });
            } catch (error) {
                res.status(500).json({
                    error: error,
                    message: "Student not inserted. Server error.",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Couldn't check duplicate student. Server error.",
        });
    }
});

// Update
StudentRouter.put(
    "/update_student/:roll",
    async (req: Request, res: Response) => {
        const { roll } = req.params;
        const { name } = req.body;
        try {
            const updatedStudent = await prisma.student.update({
                where: {
                    roll: parseInt(roll),
                },
                data: {
                    name: name,
                    roll: parseInt(roll),
                },
            });
            res.status(200).json({
                data: updatedStudent,
                message: "Student updated successfully.",
            });
        } catch (error) {
            res.status(500).json({
                error: error,
                message: "Student not updated. Server error.",
            });
        }
    }
);

// Delete
StudentRouter.delete(
    "/delete_student/:roll",
    async (req: Request, res: Response) => {
        const { roll } = req.params;
        try {
            const deletedStudent = await prisma.student.delete({
                where: {
                    roll: parseInt(roll),
                },
            });
            res.status(200).json({
                data: deletedStudent,
                message: "Student deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                error: error,
                message: "Couldn't delete student. Server error.",
            });
        }
    }
);
export default StudentRouter;
