module.exports = async (__, args, cxt) => {
  try {
    const id = args.request.id

    console.log(id)

    const section = await cxt.section.addInitialSections(id)

    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.SECTION_ADDED, {
      sectionAdded: section,
    });

    return section
  } catch (e) {
    console.log(e)
    return null
  }
}
