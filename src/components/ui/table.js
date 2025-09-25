"use client"
import * as React from "react"

export function Table({ className, ...props }) {
  return (
    <table
      className={`min-w-full  divide-y divide-grey-500  text-sm ${className}`}
      {...props}
    />
  )
}

export function TableHeader({ className, ...props }) {
  return (
    <thead
      className={` uppercase text-xs ${className}`}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }) {
  return (
    <tbody className={`divide-y divide-grey-500 ${className}`} {...props} />
  )
}

export function TableRow({ className, ...props }) {
  return <tr className={`${className}`} {...props} />
}

export function TableHead({ className, ...props }) {
  return (
    <th className={`px-2 py-3 text-left ${className}`} {...props} />
  )
}

export function TableCell({ className, ...props }) {
  return (
    <td className={`px-2 py-3 text-gray-700 font-medium ${className}`} {...props} />
  )
}

export function TableCaption({ className, ...props }) {
  return (
    <caption
      className={`mt-4 text-sm text-grey-700 text-left ${className}`}
      {...props}
    />
  )
}
