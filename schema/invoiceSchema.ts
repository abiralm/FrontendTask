import z from "zod";

export const invoiceSchema = z.object({
    customer: z.string().min(1, "Customer name is required"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().min(1, "Description is required"),
    items: z.array(
        z.object({
            item: z.string().min(1, "Item name is required"),
            qty: z.string().min(1, "Quantity is required"),
            price: z.number().min(0.01, "Price must be greater than 0"),
        })
    ).min(1, "At least one item is required"),
})