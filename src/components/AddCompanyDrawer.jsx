import React, { useEffect } from 'react'
import {
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Input,
} from "@/components"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/useFetch'
import { addNewCompany } from '@/api/companiesApi'


const schema = z.object({
    name: z.string().min(1, { message: "Name of comapny is required" }),
    logo: z.any().refine(
        (file) => (file[0] &&
            (file[0].type === "image/png" || file[0].type === "image/jpeg" || file[0].type === "image/jpg" || file[0].type === "image/webp" || file[0].type === "image/svg+xml")
        ),
        { message: "Logo is required" })
})
function AddCompanyDrawer({ fetchComapny }) {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema)
    })

    const { fn: fnAddCompany, loading: loadingAddCompany, error: errorAddCompany, data: dataAddCompany } = useFetch(addNewCompany)

    function onSubmit(data) {
        fnAddCompany({
            ...data,
            logo: data.logo[0]
        })
    }
    useEffect(() => {
        if (dataAddCompany?.length > 0) fetchComapny()
    }, [loadingAddCompany])
    return (
        <Drawer >
            <DrawerTrigger>
                <Button variant='secondary' size='sm' type='button'>Add new Company</Button></DrawerTrigger>
            <DrawerContent className='px-10'>
                <DrawerHeader>
                    <DrawerTitle>Add new Company</DrawerTitle>
                    <DrawerDescription>Enter details of company</DrawerDescription>
                </DrawerHeader>
                <form className='flex flex-col gap-6 px-4'>
                    <Input
                        type='text'
                        placeholder="Enter company name"
                        {...register("name")}
                    />
                    {errors.name && (<p className='text-red-500'>{errors.name.message}</p>)}

                    <Input
                        type='file'
                        accept="image/*"
                        className='file:text-gray-500'
                        {...register("logo")}
                    />
                    {errors.logo && (<p className='text-red-500'>{errors.logo.message}</p>)}

                    <Button
                        type='button'
                        className='w-full'
                        onClick={handleSubmit(onSubmit)}
                    >Submit</Button>
                </form>
                {errorAddCompany?.message && (<p className='text-red-500'>{errorAddCompany?.message}</p>)}

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" type='button'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

export default AddCompanyDrawer
