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
import { ReactNode } from "react"

type InvoiceFormProps = {
    trigger: ReactNode
}

export function InvoiceForm({ trigger }: InvoiceFormProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Invoice</DialogTitle>
                    <DialogDescription>
                        Create a new invoice.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Customer</Label>
                        <Input />
                    </div>
                    <div className="grid gap-3">
                        <Label>Amount</Label>
                        <Input />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}