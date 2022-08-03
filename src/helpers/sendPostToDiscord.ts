import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonStyle, Colors, TextChannel } from 'discord.js'
import PostType from '@/models/PostType'
import getDerivativeSymbolOrName from '@/helpers/getDerivativeSymbolOrName'
import handleError from '@/helpers/handleError'
import sendErrorToDiscord from '@/helpers/sendErrorToDiscord'

export default async function (
  channel: TextChannel,
  id: number,
  type: PostType,
  derivativeAddress: string,
  postContent: string
) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve-${id}-${type}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${id}-${type}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const name = await getDerivativeSymbolOrName(derivativeAddress, type)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(
      `Post #${id} from ${name} ${type === PostType.email ? '' : 'ERC721'}`
    )
    .setDescription(postContent)
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (error) {
    handleError('Error sending post to Discord', error)
    await sendErrorToDiscord(channel, error, 'sending post to Discord')
  }
}
