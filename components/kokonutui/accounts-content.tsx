
"use client"

import { Wallet, Plus, CreditCard, PiggyBank, Landmark, TrendingUp, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Account } from "@/lib/types"

const getAccountIcon = (type: string) => {
  switch (type) {
    case "savings":
      return PiggyBank
    case "credit":
      return CreditCard
    case "checking":
      return Landmark
    default:
      return Wallet
  }
}

const getAccountColor = (type: string) => {
  switch (type) {
    case "savings":
      return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    case "credit":
      return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    case "checking":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    default:
      return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
  }
}

interface AccountsContentProps {
  initialAccounts: Account[]
}

export default function AccountsContent({ initialAccounts }: AccountsContentProps) {
  const accounts = initialAccounts

  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = accounts.filter((a) => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your financial accounts</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Add a new financial account to track your travel funds.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="e.g., Travel Savings" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" placeholder="e.g., Chase Bank" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input id="balance" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Add Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Assets</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">${totalAssets.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Liabilities</span>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <CreditCard className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">${totalLiabilities.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Net Worth</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <Wallet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${netWorth.toLocaleString()}</p>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
        <div className="p-6 border-b border-gray-100 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Accounts</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-[#1F1F23]">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type)
            const colorClass = getAccountColor(account.type)

            return (
              <div
                key={account.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1A1A1F] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{account.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* {account.institution} • {account.currency} */}
                      {account.currency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${account.balance < 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                        }`}
                    >
                      {account.balance < 0 ? "-" : ""}
                      {account.currency === "EUR" ? "€" : "$"}
                      {Math.abs(account.balance).toLocaleString()}
                    </p>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">Updated {account.lastUpdated}</p> */}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Update Balance</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
          {accounts.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No accounts found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
