"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { InvoiceForm } from "./_component/invoiceForm"
import { getInvoices } from "@/lib/api"
import { InvoiceType } from "@/types/authTypes"

const Invoices = () => {
    const router = useRouter()
    const [invoices, setInvoices] = useState<InvoiceType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("accessToken")

        if (!token) {
            router.replace("/login")
            return
        }

        const loadInvoices = async () => {
            try {
                const data = await getInvoices()
                setInvoices(data.invoices)
            } catch (error: any) {
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    localStorage.removeItem("accessToken")
                    router.replace("/login")
                }
            } finally {
                setLoading(false)
            }
        }

        loadInvoices()
    }, [router])

    if (loading) {
        return <p className="p-4">Loading invoices...</p>
    }

    return (
        <div className="m-4 border-2 rounded-2xl">
            <div className="flex justify-between items-center p-2">
                <p className="text-2xl font-extrabold">Invoice List</p>
                <InvoiceForm trigger={<Button>Add new invoice</Button>} />
            </div>

            <Table className="p-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.date}>
                            <TableCell>{invoice.customer}</TableCell>
                            {/* <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell>${invoice.totalAmount}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell>
                            {/* ${invoices.reduce((sum, i) => sum + i.totalAmount, 0)} */}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default Invoices