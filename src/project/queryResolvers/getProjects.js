export default async (__, args, cxt) => {
  try {
    const projects = await cxt.project.getProjects()
    return projects
  } catch (e) {
    console.log('error =>', e)
    return null
  }
}
