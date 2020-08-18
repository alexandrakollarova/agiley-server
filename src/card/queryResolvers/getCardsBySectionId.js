export default async (__, args, cxt) => {
  try {
    const sectionId = args.request.sectionId

    const cards = await cxt.card.getCardsBySectionId(sectionId)
    return cards
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
