"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const MainPlaygroundPage = () => {
    const {id} = useParams<{id:string}>()
  return (
    <div>
        Params : {id}
    </div>
  )
}

export default MainPlaygroundPage