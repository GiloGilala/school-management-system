import path from 'path'
import express from 'express'
import multer from 'multer'
import File from '../../models/exam/paper.js';
const __dirname = path.resolve();

const Router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, './ReferencePaper');
      },
      filename(req, file, cb) {
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2 // max file size 2MB 
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'Please Uploadfiles only with the extensions pdf, doc, docx, xslx, xls.'
          )
        );
      }
      cb(undefined, true); // continue with upload
    }
  });

  Router.post(
    '/uploadpaper',
    upload.single('files'),
    async (req, res) => {
      try {
        const { paperdescription, year } = req.body;
        const { path, mimetype } = req.file;
        const file = new File({
            paperdescription,
            year,
          file_path: path,
          file_mimetype: mimetype
        });
        await file.save();
        res.send('Paper has been uploaded');
      } catch (error) {
        res.status(400).send('Error uploading'+ error);
      }
    },
    (error, req, res, next) => {
      if (error) {
        res.status(500).send(error.message);
      }
    }
  );

  Router.get('/downloadpapers', async (req, res) => {
    try {
      const files = await File.find({});
      const sortedByCreationDate = files.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      res.send(sortedByCreationDate);
    } catch (error) {
      res.status(400).send('Something went wrong while downloading papers');
    }
  });
  
  Router.get('/downloadpapers/:id', async (req, res) => {
      
    try {
      const file = await File.findById(req.params.id);
      res.set({
        'Content-Type': file.file_mimetype
      });
     res.sendFile(path.join(__dirname , '..', 'backend' ,file.file_path));
  
    } catch (error) {
      res.status(400).send('Something went wrong while downloading papers '+ error);
    }
  });

  Router.put('/updatepapers', async (req,res) => {

    const NewpaperDdescription =req.body.NewpaperDdescription;
    const NewYear = req.body.NewYear;
    const Newid = req.body.id;
    console.log(NewpaperDdescription,NewYear,Newid);
    
      try {
      
        await File.findById(Newid, (error,updateRecord)=>{
          updateRecord.paperdescription = NewpaperDdescription;
          updateRecord.year = NewYear;
          updateRecord.save();
        });
        
      } catch (error) {
        console.log(error);
      }
      res.send('file updated successfully.');
    });
    
    Router.get('/downloadpaper/:id', async (req, res) => {
        try {
          const id= req.params.id
          const files = await File.findById(id);
         res.send({status:"Papers fetched" ,files});
        } catch (error) {
          console.log(error);
          res.status(400).send('Something went wrong');
        }
      });

      Router.delete('/removepaper/:id', async (req,res) =>{
        const id = req.params.id
        await File.findByIdAndRemove(id).exec()
        res.send("Paper Deleted");
      })

      Router.get('/searchpaper', (req, res,next) => {

        const searchField= req.query.paperdescription;
        File.find({paperdescription:{$regex: searchField, $options: '$i'}}).then(data=>{
          res.send(data);
        })
      
    })
      //http://localhost:5000/paper/searchpaper?paperdescription=description 2 






export default Router;