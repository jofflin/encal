'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { logger } from '@lib/logger'
import { useRouter } from 'next/navigation'
//icons
import { BiHide, BiLockAlt, BiShow } from 'react-icons/bi'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  // const { isOpen: isOpenCollapse, onToggle: onToggleCollapse } = useDisclosure()
  // const { isOpen: isOpenEmail, onToggle: onToggleEmail } = useDisclosure()
  const { data: session, status } = useSession()
  const router = useRouter()

  console.log(session, status)

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
        callbackUrl: '/',
      })
      logger.debug(`signing:onsubmit:res`, res)
    } catch (error) {
      logger.error(error)
    }
  }

  if (status === 'authenticated') {
    router.push('/')
  }

  return (
    <div className="centered-card">
      <div className="centered-card-content">
        <div className="flex flex-col items-center justify-center">
          <div className="centered-card-icon">
            <BiLockAlt className="h-6 w-6" />
          </div>
          <h1 className="centered-card-header">Sign In</h1>
        </div>
        <form className="form-design" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label htmlFor="username" className="input-label">
              Email
            </label>
            <input
              type="email"
              placeholder=" "
              className="input-field"
              {...register('username', {
                required: 'Email is required',
              })}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message as string}</p>
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
            <a href="/auth/signup" className="simple-link">
              No Account yet? Sign Up
            </a>
          </div>
          <div className="form-section">
            <button type="submit" className="submit-button">
              {isSubmitting ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
