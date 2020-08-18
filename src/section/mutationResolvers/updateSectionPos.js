export default async (__, args, cxt) => {
  try {
    const sectionId = args.request.sectionId
    const pos = args.request.pos

    const section = await cxt.section.updateSectionPos(sectionId, pos)

    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.ON_SECTION_POS_CHANGE, {
      onSectionPosChange: section,
    })
    return section
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
