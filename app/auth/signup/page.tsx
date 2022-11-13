'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logger } from '@lib/logger'
import { useRouter } from 'next/navigation'
import { BiHide, BiLockAlt, BiShow } from 'react-icons/bi'

export default function SignupCard() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(values: any) {
    try {
      // check if passwords match
      if (values.password !== values.passwordConfirm) {
        throw new Error('Passwords do not match')
      }
      const body = { ...values }
      console.log(`POSTing ${JSON.stringify(body, null, 2)}`)
      const res = await fetch(`/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      logger.debug(`res`, res)
      reset()
      router.push(`signin`)
    } catch (error) {
      console.error(error)
    }
  }

  // Sign Up Page with Name, Mail, Password, and Confirm Password
  return (
    <div className="flex min-h-screen flex-col py-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border-0 bg-white px-4 py-8 shadow-lg sm:rounded-3xl">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
            <BiLockAlt className="h-6 w-6" />
          </div>
          <h1 className="mb-8 text-2xl font-semibold text-gray-900">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                })}
                className="block w-full rounded-md border-gray-300 py-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                className="block w-full rounded-md border-gray-300 py-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
                className="block w-full rounded-md border-gray-300 py-1 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="py-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {showPassword ? (
                    <BiHide className="h-6 w-6" />
                  ) : (
                    <BiShow className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                id="confirmPassword"
                type={showPasswordConfirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return 'Your passwords do no match'
                    }
                  },
                  required: 'Confirm Password is required',
                })}
                className="block w-full rounded-md border-gray-300 py-1 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className={`text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {showPasswordConfirm ? (
                    <BiHide className="h-6 w-6" />
                  ) : (
                    <BiShow className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
              {/*  SPinner if is submitting*/}
              {isSubmitting && (
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
