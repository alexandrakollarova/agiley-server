module.exports = async (__, args, cxt) => {
  try {
    const projects = await cxt.project.getProjects()
    return projects
  } catch (e) {
    console.log("Error => ", e)
    return null
  }
}
