"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { postInvoices } from "@/lib/api"
import axios from "axios"
import { invoiceSchema } from "@/schema/invoiceSchema"

type InvoiceFormData = z.infer<typeof invoiceSchema>

type InvoiceFormProps = {
    trigger: ReactNode
    onSuccess?: () => void
}

export function InvoiceForm({ trigger, onSuccess }: InvoiceFormProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            customer: "",
            date: "",
            dueDate: "",
            description: "",
            items: [{ item: "", qty: "", price: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    const onSubmit = async (data: InvoiceFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const formattedData = {
                ...data,
                items: data.items.map((item) => ({
                    ...item,
                    qty: item.qty,
                })),
            }

            await postInvoices(formattedData)

            reset()
            setOpen(false)

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to create invoice")
            } else {
                setError("An unexpected error occurred")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Invoice</DialogTitle>
                    <DialogDescription>
                        Create a new invoice with items and due dates.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="customer">Customer *</Label>
                        <Input
                            id="customer"
                            placeholder="Enter customer name"
                            {...register("customer")}
                        />
                        {errors.customer && (
                            <p className="text-sm text-destructive">
                                {errors.customer.message}
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Invoice Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register("date")}
                            />
                            {errors.date && (
                                <p className="text-sm text-destructive">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dueDate">Due Date *</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                {...register("dueDate")}
                            />
                            {errors.dueDate && (
                                <p className="text-sm text-destructive">
                                    {errors.dueDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            placeholder="Enter invoice description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                            <Label>Items *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({ item: "", qty: "", price: 0 })
                                }
                            >
                                + Add Item
                            </Button>
                        </div>

                        <div className="space-y-3 border rounded-lg p-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-2 items-end"
                                >
                                    <div className="col-span-5">
                                        <Label htmlFor={`items.${index}.item`} className="text-xs">
                                            Item
                                        </Label>
                                        <Input
                                            id={`items.${index}.item`}
                                            placeholder="Item name"
                                            {...register(`items.${index}.item`)}
                                        />
                                        {errors.items?.[index]?.item && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.items[index]?.item?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor={`items.${index}.qty`} className="text-xs">
                                            Qty
                                        </Label>
                                        <Input
                                            id={`items.${index}.qty`}
                                            placeholder="Qty"
                                            {...register(`items.${index}.qty`)}
                                        />
                                        {errors.items?.[index]?.qty && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.items[index]?.qty?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-3">
                                        <Label htmlFor={`items.${index}.price`} className="text-xs">
                                            Price
                                        </Label>
                                        <Input
                                            id={`items.${index}.price`}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register(`items.${index}.price`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.items?.[index]?.price && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.items[index]?.price?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="w-full"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {errors.items && (
                                <p className="text-sm text-destructive">
                                    {errors.items.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Invoice"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}