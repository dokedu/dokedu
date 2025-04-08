import s3Driver from "unstorage/drivers/s3"
import fsDriver from "unstorage/drivers/fs"

export default defineNitroPlugin(() => {
  const storage = useStorage()

  // return file storage for dev
  if (process.dev) {
    storage.mount(
      "files",
      fsDriver({
        base: "./storage/files"
      })
    )
    return
  }

  const driver = s3Driver({
    accessKeyId: useRuntimeConfig().s3AccessKeyId,
    secretAccessKey: useRuntimeConfig().s3SecretAccessKey,
    endpoint: useRuntimeConfig().s3Endpoint,
    bucket: useRuntimeConfig().s3Bucket,
    region: useRuntimeConfig().s3Region
  })

  storage.mount("files", driver)
})
