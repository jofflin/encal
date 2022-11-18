'use client'

import { Place } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { logger } from '@lib/logger'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Props = {
  place?: Place
}

export default function ConfigurePlace({ place }: Props) {
  //  create or update place
  const router = useRouter()
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const session = useSession()
  if (!session) {
    return <div>loading...</div>
  }

  async function onSubmit(values: any) {
    try {
      const body = { ...values, userId: session.data?.user?.email }
      console.log(`POSTing ${JSON.stringify(body, null, 2)}`)
      let res: Place
      if (place) {
        res = await fetch(`/api/place/${place.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.json())
      } else {
        res = await fetch(`/api/place/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.json())
      }
      logger.debug(`res`, res)
      router.push(`/configuration/place/${res.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  // return page with heading and form inside a card
  return (
    <div className="centered-card">
      <div className="centered-card-content">
        <h1 className="centered-card-header">
          {place ? 'Edit' : 'Create'} Place
        </h1>
        <form className="form-design" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label className="input-label">Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Name"
              {...register('name', { required: true })}
              defaultValue={place?.name}
            />
            {errors.name && (
              <p className="error-text">This field is required</p>
            )}
          </div>
          <div className="form-section">
            <label className="input-label">Base Price (Euro per month)</label>
            <input
              className="input-field"
              type="number"
              placeholder="0"
              {...register('basePrice', { required: true })}
              defaultValue={place?.basePrice}
            />
            {errors.basePrice && (
              <p className="error-text">This field is required</p>
            )}
          </div>
          <div className="form-section">
            <label className="input-label">Kwh Price (Cents per Kwh)</label>
            <input
              className="input-field"
              type="number"
              placeholder="0"
              {...register('kwhPrice', { required: true })}
              defaultValue={place?.kwhPrice}
            />
            {errors.kwhPrice && (
              <p className="error-text">This field is required</p>
            )}
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Submit'}
          </button>
          {/* Create cancel link with href*/}
          <Link href="/configuration">
            <button className="cancel-button" disabled={isSubmitting}>
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}
