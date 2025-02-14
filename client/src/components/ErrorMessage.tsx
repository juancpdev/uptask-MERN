import React from "react";

export default function ErrorMessage({children} : {children : React.ReactNode}) {
  return (
    <p className=" text-red-600 text-sm p-1 pb-0">{children}</p>
  )
}
