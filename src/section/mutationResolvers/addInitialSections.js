export default async (__, args, cxt) => {
  try {
    const projectId = args.request.projectId
    const sectionsInfo = [
      { title: 'todo', label: 'todo', pos: 2048, projectId: projectId },
      { title: 'in progress', label: 'in progress', pos: 19456, projectId: projectId },
      { title: 'done', label: 'done', pos: 35840, projectId: projectId }
    ]

    const section = await cxt.section.addInitialSections(sectionsInfo)

    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.SECTION_ADDED, {
      sectionAdded: section,
    })

    return section
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
