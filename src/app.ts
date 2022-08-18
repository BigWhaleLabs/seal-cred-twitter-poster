import 'module-alias/register'
import 'source-map-support/register'

import checkPostsContracts from '@/helpers/checkPostsContracts'
import runMongo from '@/helpers/mongo'
import runServer from '@/helpers/runServer'
import startButtonListeners from '@/helpers/startButtonListeners'
import startContractListeners from '@/helpers/startContractListeners'
import startDiscordClient from '@/helpers/startDiscordClient'
import startTwitterPoster from '@/helpers/startTwitterPoster'

void (async () => {
  console.log('Connecting to mongo...')
  await runMongo()
  console.log('Connected to mongo')

  console.log('Starting discord bot...')
  await startDiscordClient()
  console.log('Discord bot started')

  console.log('Adding button listeners...')
  await startButtonListeners()
  console.log('Added button listeners')

  console.log('Checking post contracts...')
  await checkPostsContracts()
  console.log('Checked post contracts')

  console.log('Starting contract listeners...')
  await startContractListeners()
  console.log('Started contract listeners')

  console.log('Starting twitter poster...')
  startTwitterPoster()
  console.log('Twitter poster started')

  console.log('Starting app...')
  await runServer()
  console.log('App started')
})()
