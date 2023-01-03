import PageHeading from '@components/page-heading'

export default async function LinkDevice() {
  // create a page that links devices with a one-time code
  return (
    <div>
      <PageHeading title="Link Device"></PageHeading>
      {/*  create form where device can be selected and then a one-time code is generated*/}
      <form>
        <label htmlFor="device">Device</label>
        <select name="device" id="device">
          <option value="1">Device 1</option>
          <option value="2">Device 2</option>
          <option value="3">Device 3</option>
        </select>
        <button type="submit">Generate Code</button>
      </form>
    </div>
  )
}
