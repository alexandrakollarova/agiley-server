export default async (__, args, cxt) => {
  try {
    const projectInfo = {
      title: args.request.title
    }
    console.log('CONTEXT PUBLISHER', cxt.publisher)

    const project = await cxt.project.insertProject(projectInfo)

    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.PROJECT_ADDED, {
      projectAdded: project
    })
    return project
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
