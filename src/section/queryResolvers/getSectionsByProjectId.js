export default async (__, args, cxt) => {
  try {
    const projectId = args.request.projectId

    const sections = await cxt.section.getSectionsByProjectId(projectId)

    return sections
  } catch (e) {
    console.log('error => ', e)
    return null
  }
}
