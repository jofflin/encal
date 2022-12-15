'use client'

import { Room } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { logger } from '@lib/logger'
import Link from 'next/link'

type Props = {
  room?: Room
  placeId: string
}

export default function ConfigureRoom({ room, placeId }: Props) {
  //  create or update place
  const router = useRouter()
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const baseRoute = `/configuration/${placeId}`

  async function onSubmit(values: any) {
    try {
      const body = { ...values, placeId }
      console.log(`POSTing ${JSON.stringify(body, null, 2)}`)
      let res: Room
      if (room) {
        res = await fetch(`/api/room/${room.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.json())
      } else {
        res = await fetch(`/api/room/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.json())
      }
      logger.debug(`res`, res)
      router.push(`${baseRoute}/${res.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  // return page with heading and form inside a card
  return (
    <div className="centered-card">
      <div className="centered-card-content">
        <h1 className="centered-card-header">
          {room ? 'Edit' : 'Create'} Room
        </h1>
        <form className="form-design" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label className="input-label">Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Name"
              {...register('name', { required: true })}
              defaultValue={room?.name}
            />
            {errors.name && (
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
          <Link href={baseRoute}>
            <button className="cancel-button" disabled={isSubmitting}>
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}
