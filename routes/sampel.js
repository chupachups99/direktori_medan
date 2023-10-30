var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('select company.nama, company.alamat, company.status, sampel.nama_survei from sampel inner join company ON (sampel.id_perusahaan=company.id_perusahaan) ORDER BY nama',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('sampel',{data:''});   
        } else {
               dbConn.query('select survey from survei',function(err,tes){
                    if(!err){
                        res.render('sampel',{data:rows,survei:tes});
                    }
               })
                
            // render to views/users/index.ejs
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    dbConn.query('SELECT DISTINCT Kec,Nama_Kec FROM kode', function(err, rows) {
        if(err) throw err
        else {
            // render to add.ejs
            res.render('perusahaan/add', {wilayah_data:rows});
        }
    })
})

// add a new user
router.post('/add', function(req, res, next) {    
    let nama = req.body.nama;
    let alamat = req.body.alamat;
    let kontak = req.body.kontak;
    let status = req.body.status;
    let pemilik = req.body.pemilik;
    let id_sbr = req.body.id_sbr;
    let kecamatan = req.body.kecamatan;
    let kelurahan = req.body.kelurahan;
    let kbli = req.body.kbli;
    let kategori = req.body.kategori;
    let keterangan = req.body.keterangan;
    
  
    
     
                        var form_data = {
                            nama: nama,
                            alamat: alamat,
                            kontak : kontak,
                            status: status,
                            pemilik: pemilik,
                            kecamatan:kecamatan,
                            kelurahan:kelurahan,
                            kategori :kategori,
                            kbli: kbli,
                            keterangan:keterangan
                        }
                        
                        // insert query
                        dbConn.query('INSERT INTO company SET ?', form_data, function(err, result) {
                            //if(err) throw err
                            if (err) {
                                req.flash('error', err);
                        
                                // render to add.ejs
                                res.redirect('/perusahaan/add');
                            } else {                
                                req.flash('success', 'Perusahaan successfully added');
                                res.redirect('/perusahaan');
                            }
                        })
                    
        
                
      
           
    
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT kode.Nama_Kec,kode.Nama_Kel, company.* FROM company INNER JOIN kode ON (company.kecamatan=kode.Kec AND company.kelurahan=kode.Kel) WHERE id_perusahaan = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Perusahaan dengan id = ' + id + ' tidak ditemukan')
            res.redirect('/perusahaan')
        }
        // if user found
        else {
         
            // render to edit.ejs
            dbConn.query('Select DISTINCT Kec,Nama_Kec from kode',function(err,wilayah){
                if(!err){
                    dbConn.query('SELECT DISTINCT nama_survei from sampel where id_perusahaan='+id,function(err,survei){
                        if(!err){
                            res.render('perusahaan/edit', {
                                title: 'Edit Perusahaan', 
                                id: rows[0].id_perusahaan,
                                id_sbr : rows[0].id_sbr,
                                keterangan : rows[0].keterangan,
                                nama: rows[0].nama,
                                alamat: rows[0].alamat,
                                kontak: rows[0].kontak,
                                status:rows[0].status,
                                pemilik: rows[0].pemilik,
                                kecamatan:rows[0].kecamatan,
                                kelurahan_var:rows[0].kelurahan,
                                nama_kecamatan: rows[0].Nama_Kec,
                                nama_kel: rows[0].Nama_Kel,
                                kategori : rows[0].kategori,
                                kbli: rows[0].kbli,
                                wilayah_data:wilayah,
                                survei:survei
                            })
                        }
                    })
                  
                }
            })
                
        
            
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nama = req.body.nama;
    let alamat = req.body.alamat;
    let kontak = req.body.kontak;
    let status = req.body.status;
    let pemilik = req.body.pemilik;
    let id_sbr = req.body.id_sbr;
    let kecamatan = req.body.kecamatan;
    let kelurahan = req.body.kelurahan;
    let kbli = req.body.kbli;
    let kategori = req.body.kategori;
    let keterangan = req.body.keterangan;
    let errors = false;

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nama: nama,
            alamat: alamat,
            kontak : kontak,
            status: status,
            pemilik: pemilik,
            kecamatan:kecamatan,
            kelurahan:kelurahan,
            kategori :kategori,
            kbli: kbli
        }
        // update query
        dbConn.query('UPDATE company SET ? WHERE id_perusahaan = ' + id, form_data, function(err, result) {
            //if(err) throw err
                if(!err){
                        
                req.flash('success', 'Perusahaan berhasil diperbarui');
                res.redirect('/perusahaan');
                }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('INSERT INTO arsip SELECT * FROM company where id_perusahaan=' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/perusahaan')
        } else {
            dbConn.query('DELETE from company where id_perusahaan='+id,function(err,result){
                if(!err){
                      // set flash message
                     req.flash('success', 'Perusahaan telah di arsipkan')
                    // redirect to user page
                    res.redirect('/perusahaan')
                }
            })
          
        }
    })
})

router.post('/checkcompany',function(request, response, next) {
	let nama = request.body.nama;
    let alamat = request.body.alamat;
	//let sql = 'SELECT COUNT(*) AS exist FROM perusahaan WHERE nama ='+ nama + 'AND alamat ='+alamat ;
	let sql = 'SELECT * FROM PERUSAHAAN WHERE nama="'+nama+'" AND alamat ="'+alamat+'"';
    dbConn.query(sql, function(error, result) {
            //let count = result[0].count;
            let count = Object.keys(result).length;
            response.status(200).json({isi:count});

            // if(count==1){
            //     let compExist = "true";
            //     //console.log(compExist);
            //     //response.status(200).json({compExist:compExist});
                      
            // }
            // else{
            //     let compExist = "false";
            //     //console.log(compExist);
            //     //response.status(200).json({compExist:compExist});
      
            // }
      
	})
    //response.status(400).json("hehe");
})

router.get('/get_data', function(request, response, next){

    var type = request.query.type;

    var search_query = request.query.parent_value;

    if(type == 'load_kel')
    {
        var query = `
        SELECT Kel,Nama_Kel FROM kode 
        WHERE Kec = '${search_query}' 
        ORDER BY Kel ASC
        `;
    }


    dbConn.query(query, function(error, data){

        var data_arr = [];

        data.forEach(function(row){
            gabungan = "["+row.Kel+"] "+row.Nama_Kel;
            data_arr.push(gabungan);
        });

        response.json(data_arr);

    });

});

module.exports = router;