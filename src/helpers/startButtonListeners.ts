import { ButtonInteraction, Colors } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import getChannel from '@/helpers/getChannel'
import logError from '@/helpers/logError'

export default async function () {
  const channel = await getChannel()
  const collector = channel.createMessageComponentCollector({
    filter: (message) => RegExp(`(a|r)-.+-\\d+`, 'gi').test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    const isApprove = interaction.customId.startsWith('a')
    // const discordUsername = interaction.user.username
    const components = interaction.customId.split('-')
    const contractAddress = components[1]
    const blockchainId = parseInt(components[2])
    // const embed = new EmbedBuilder()
    //   .setColor(interaction.message.embeds[0].color)
    //   .setTitle(
    //     `${
    //       isApprove ? 'Approved' : 'Rejected'
    //     } post #${blockchainId} by ${discordUsername}`
    //   )
    //   .setDescription(interaction.message.embeds[0].description)
    // try {
    //   await interaction.message.edit({
    //     embeds: [embed],
    //   })
    // } catch (error) {
    //   logError('wat', error)
    // }
    await TweetModel.updateOne(
      {
        contractAddress,
        blockchainId,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
  })
}
