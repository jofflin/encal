'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { logger } from '@lib/logger'
import { useRouter } from 'next/navigation'
//icons
import { BiLockAlt } from 'react-icons/bi'

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const defaultBody = {
    grant_type: '',
    username: 'asdf@gmail.com',
    password: 'asdf',
    scope: '',
    client_id: '',
    client_secret: '',
  }

  async function onSubmit(values: any) {
    try {
      const body = { ...defaultBody, ...values }
      console.log(`POSTing ${JSON.stringify(body, null, 2)}`)
      const res = await signIn('credentials', {
        ...body,
        redirect: false,
        // callbackUrl: router.query.callbackUrl,
      })
      logger.debug(`signing:onsubmit:res`, res)
    } catch (error) {
      logger.error(error)
    }
  }

  return (
    <div className="-mt-56 flex min-h-screen flex-col items-center justify-center py-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border-0 bg-white px-4 py-8 shadow-lg sm:rounded-3xl">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
            <BiLockAlt className="h-6 w-6" />
          </div>
          <h1 className="mb-8 text-2xl font-semibold text-gray-900">Sign In</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative z-0 mb-5 w-full">
            <input
              type="email"
              placeholder=" "
              className="focus:shadow-outline h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none"
              {...register('username', {
                required: 'Email is required',
              })}
            />
            <label
              htmlFor="username"
              className="absolute left-3 -top-2.5 bg-white text-xs font-medium tracking-wide text-gray-500 transition-all duration-150 ease-in-out"
            >
              Email
            </label>
            {errors.username && (
              <p className="text-xs text-red-500">
                {errors.username.message as string}
              </p>
            )}
          </div>
          <div className="relative z-0 mb-5 w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              className="focus:shadow-outline h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2.5 bg-white text-xs font-medium tracking-wide text-gray-500 transition-all duration-150 ease-in-out"
            >
              Password
            </label>
            {errors.password && (
              <p className="text-xs text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                className="text-sm font-medium text-blue-500 transition duration-150 ease-in-out hover:text-blue-700"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-3 py-4 text-white shadow outline-none transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none active:bg-blue-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
