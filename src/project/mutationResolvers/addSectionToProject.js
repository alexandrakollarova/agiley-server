module.exports = async (__, args, cxt) => {
  try {
    const id = args.request.id
    const sectionInfo = {
      title: args.request.title,
      label: args.request.label,
      pos: args.request.pos,
    }

    const project = await cxt.project.addSectionToProject(id, sectionInfo)

    // cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.SECTION_ADDED, {
    //   sectionAdded: section,
    // });

    return project
  } catch (e) {
    console.log(e)
    return null
  }
}
