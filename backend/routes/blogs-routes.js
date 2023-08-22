const express = require('express');
const { check } = require('express-validator');

const blogsControllers = require('../controllers/blogs-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:pid', blogsControllers.getBlogById);

router.get('/user/:uid', blogsControllers.getBlogsByUserId);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
    
  ],
  blogsControllers.createBlog
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  blogsControllers.updateBlog
);

router.delete('/:pid', blogsControllers.deleteBlog);

module.exports = router;
