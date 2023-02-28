import { Cast } from '@/models/Cast'
import { PostModel } from '@/models/Post'
import env from '@/helpers/env'
import fetch from 'node-fetch'

export default async function (contractAddress: string, threadId: string) {
  const thread = await fetch(
    `https://api.warpcast.com/v2/all-casts-in-thread?threadHash=${threadId}`,
    {
      headers: {
        authorization: `Bearer ${env.FARCASTER_AUTH_TOKEN}`,
      },
    }
  )

  const {
    result: { casts },
  } = (await thread.json()) as {
    result: { casts: Cast[] }
  }

  const serviceIds = casts.map((cast) => cast.hash)

  const statuses = await PostModel.find({
    contractAddress,
    serviceId: { $in: serviceIds },
    postingService: 'farcaster',
  })

  const statusesMap = new Map(
    statuses.map((status) => [status.serviceId, status.id])
  )

  return casts
    .filter((cast) => cast.text)
    .map(({ timestamp, author, hash, threadHash, parentHash, text }) => ({
      postId: statusesMap.get(hash),
      hash,
      threadHash,
      parentHash,
      timestamp,
      author,
      text,
    }))
}
