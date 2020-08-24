export default async (__, args, cxt) => {
  try {
    const projectInfo = {
      title: args.request.title
    }
    console.log('CONTEXT ===>', cxt)

    const project = await cxt.project.insertProject(projectInfo)

    // cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.PROJECT_ADDED, {
    //   projectAdded: project
    // })

    cxt.pubsub(cxt.subscriptions.PROJECT_ADDED, {
      projectAdded: project
    })

    return project
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
