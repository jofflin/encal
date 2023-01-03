'use client'

import { Device } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { logger } from '@lib/logger'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Props = {
  device?: Device
  roomId: string
  placeId: string
  deviceTypes: string[]
}

export default function ConfigureDevice({
  device,
  roomId,
  deviceTypes,
  placeId,
}: Props) {
  //  create or update place
  const router = useRouter()
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const baseRoute = `/configuration/${placeId}/${roomId}`

  const session = useSession()
  if (!session) {
    return <div>loading...</div>
  }

  async function onSubmit(values: any) {
    try {
      const body = { ...values, roomId }
      console.log(`POSTing ${JSON.stringify(body, null, 2)}`)
      let res: Device
      if (device) {
        res = await fetch(`/api/device/${device.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.json())
      } else {
        res = await fetch(`/api/device/create`, {
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
  // @ts-ignore
  return (
    <div className="centered-card">
      <div className="centered-card-content">
        <h1 className="centered-card-header">
          {device ? 'Edit' : 'Create'} Device
        </h1>
        <form className="form-design" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label className="input-label">Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Name"
              {...register('name', { required: true })}
              defaultValue={device?.name}
            />
            {errors.name && (
              <p className="error-text">This field is required</p>
            )}
          </div>
          <div className="form-section">
            <label className="input-label">Device Type</label>
            <select
              className="input-field"
              {...register('deviceType', { required: true })}
              defaultValue={device?.deviceType}
            >
              {deviceTypes.map((key, index) => (
                <option key={index} value={key}>
                  {key}
                </option>
              ))}
            </select>
            {errors.deviceType && (
              <p className="error-text">This field is required</p>
            )}
          </div>
          <div className="form-section">
            <label className="input-label">Serial Number</label>

            <input
              className="input-field"
              type="text"
              placeholder="Serial Number"
              {...register('serialNumber', { required: false })}
              defaultValue={device?.serialNumber || ''}
            />
            {errors.serialNumber && (
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
