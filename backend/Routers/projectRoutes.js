const express = require('express');
const router = express.Router();
const { createProject, getMyProjects, fetchProject, updateProjectTasks, addTasks, ListProjects, updateProjectInfo, deleteProject } = require('../Controller/projectController');

router.post('/project-create', createProject);
router.post('/my-projects', getMyProjects);
router.get('/:id', fetchProject);
router.patch('/:id', updateProjectTasks);
router.patch('/info/:id', updateProjectInfo);
router.post('/:id/add', addTasks);
router.post('/explore', ListProjects);
router.delete('/delete/:id', deleteProject);

module.exports = router;
