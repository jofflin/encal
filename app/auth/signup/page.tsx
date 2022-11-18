'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logger } from '@lib/logger'
import { useRouter } from 'next/navigation'
import { BiHide, BiLockAlt, BiShow } from 'react-icons/bi'
import Link from 'next/link'

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
      if (values.password !== values.confirmPassword) {
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
    <div className="centered-card">
      <div className="centered-card-content">
        <div className="flex flex-col items-center justify-center">
          <div className="centered-card-icon">
            <BiLockAlt className="h-6 w-6" />
          </div>
          <h1 className="centered-card-header">Sign Up</h1>
        </div>
        <form className="form-design" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                })}
                className="input-field"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="form-section">
            <label htmlFor="email" className="input-label">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                className="input-field"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div className="form-section">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
                className="input-field"
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
          <div className="form-section">
            <label htmlFor="confirmPassword" className="input-label">
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
                className="input-field"
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
          <div className="form-section">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
          <div className="form-section">
            <Link href="/auth/signin">
              <button className="cancel-button">
                Already have an account? Sign In
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
