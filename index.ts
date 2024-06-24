import express, { Request, Response, Express } from "express";
import { employee, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app: Express = express();
const port: number = 9000;

app.use(express.json());
app.use(express.urlencoded());

app.get("/", async (req: Request, res: Response) => {
    try {
        const foundEmployees: employee[] = await prisma.employee.findMany({});
        res.send(foundEmployees);
    } catch (error) {
        console.log((error as Error).message)
    }
});

app.post("/create", async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body
        await prisma.employee.create({
            data: {
                email,
                name
            }
        });
        const foundEmployees: employee | null = await prisma.employee.findUnique({
            where: {
                email: req.body.email
            },
        });
        res.send(foundEmployees)
    } catch (error) {
        console.log((error as Error).message)
        res.status(501).send((error as Error).message)
    }
})

app.delete("/delete", async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const result: employee = await prisma.employee.delete({
            where: {
                id: userId,
            },
        });
        res.send({ message: "Data successfully deleted", data: result });
    }
    catch (error) {
        console.error((error as Error).message);
        res.status(501).send({ error: (error as Error).message });
    }
});

app.put("/update", async (req: Request, res: Response) => {
    let { newName, newMail, userId } = req.body;
    try {
        let result: employee = await prisma.employee.update({
            where: {
                id: userId,
            },
            data: {
                email: newMail,
                name: newName
            },
        });
        res.send({ message: "Data successfully updated", data: result });
    }
    catch (error) {
        console.error((error as Error).message);
        res.status(501).send({ error: (error as Error).message });
    }
});

app.listen(port, (): void => {
    const baseUrl = `http://localhost:${port}`;
    console.log(`Server is running at ${baseUrl}`);
});