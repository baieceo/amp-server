const mysql = require('mysql')

/**
   INSERT INTO calvin.account_tbl (account_id, account_pwd, account_avatar, account_role, account_perms, create_time)
   VALUES ('admin', '579d9ec9d0c3d687aaa91289ac2854e4', 'https://img.alicdn.com/tfs/TB1fbVFfu3tHKVjSZSgXXX4QFXa-230-104.png', 1, '1,2,3,4,5,6,7,8,9,10,11,12', '2019-11-15 21:55:00')
 
 * admin
 * 123456123

   INSERT INTO calvin.role_tbl (role_name, role_perms, create_time)
   VALUES 
   ('超级管理员', '1,2,3,4,5,6,7,8,9,10,11,12', '2019-11-15 21:55:00'),
   ('管理员', '1,2,3,4,5,6,7,8', '2019-11-15 21:55:00')

   

   INSERT INTO calvin.perm_tbl (perm_key, perm_name, create_time)
   VALUES 
   ('button.create', '创建按钮', '2019-11-15 21:55:00'),
   ('button.remove', '删除按钮', '2019-11-15 21:55:00'),
   ('button.modify', '修改按钮', '2019-11-15 21:55:00'),
   ('button.view', '查看按钮', '2019-11-15 21:55:00'),
   ('button.role.create', '创建角色按钮', '2019-11-15 21:55:00'),
   ('button.role.remove', '删除角色按钮', '2019-11-15 21:55:00'),
   ('button.role.modify', '修改角色按钮', '2019-11-15 21:55:00'),
   ('button.role.view', '查看角色按钮', '2019-11-15 21:55:00'),
   ('button.account.create', '创建账户按钮', '2019-11-15 21:55:00'),
   ('button.account.remove', '删除账户按钮', '2019-11-15 21:55:00'),
   ('button.account.modify.', '修改账户按钮', '2019-11-15 21:55:00'),
   ('button.account.view', '查看账户按钮', '2019-11-15 21:55:00')
 */

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  timezone: '08:00'
})

connection.connect(err => {
  if (err) {
    console.log(err.stack)
  }
})

const exec = (sql, params = null) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results, fields) => {
      if (error) {
        console.log('Query Sql: ', sql);
        console.log('Query Params: ', params);
        console.log('Query Error: ', error)

        reject(error)

        return false
      }

      resolve(results)
    })

    // connection.end()
  })
}

module.exports = {
  init () {
    const queue = [
      exec(`CREATE DATABASE IF NOT EXISTS AMP CHARACTER SET UTF8`),
      exec(`USE AMP`),
      exec(`
        CREATE TABLE IF NOT EXISTS \`site_tbl\`(
          \`id\` INT UNSIGNED AUTO_INCREMENT,
          \`creator_id\` INT NOT NULL,
          \`gmt_create\` DATETIME NOT NULL,
          PRIMARY KEY ( \`id\` )
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
      ),
      exec(`
        CREATE TABLE IF NOT EXISTS \`page_tbl\`(
          \`id\` INT UNSIGNED AUTO_INCREMENT,
          \`site_id\` INT NOT NULL,
          \`name\` VARCHAR(100) NOT NULL,
          \`is_home_page\` TINYINT NOT NULL,
          \`is_deleted\` TINYINT NOT NULL,
          \`page_order\` INT NOT NULL,
          \`url\` VARCHAR(500) NOT NULL,
          \`title\` VARCHAR(100) NOT NULL,
          \`gmt_create\` DATETIME NOT NULL,
          \`gmt_modified\` DATETIME NOT NULL,
          PRIMARY KEY ( \`id\` )
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
      ),
      exec(`
        CREATE TABLE IF NOT EXISTS \`component_tbl\`(
          \`id\` INT UNSIGNED AUTO_INCREMENT,
          \`page_id\` INT NOT NULL,
          \`package_id\` VARCHAR(100) NOT NULL,
          \`schema_name\` VARCHAR(100) NOT NULL,
          \`uid\` VARCHAR(100) UNIQUE NOT NULL,
          \`data\` TEXT,
          PRIMARY KEY ( \`id\` )
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
      )]
    /*
      INSERT INTO amp.site_tbl(creator_id, gmt_create) VALUES(1, '2019-11-11 19:15:00');
      INSERT INTO amp.page_tbl(url, site_id, page_order, name, is_home_page, is_deleted, title, gmt_create, gmt_modified) VALUES('http://render.baie.net.cn/1/a.html', 1, 0, 'a.html', 1, 0, '优惠券-首页', '2019-11-11 19:15:00', '2019-11-11 19:15:00');
      INSERT INTO amp.page_tbl(url, site_id, page_order, name, is_home_page, is_deleted, title, gmt_create, gmt_modified) VALUES('http://render.baie.net.cn/1/b.html', 1, 1, 'b.html', 0, 0, '优惠券-详情', '2019-11-11 19:15:00', '2019-11-11 19:15:00');
      INSERT INTO amp.component_tbl(package_id, uid, page_id) VALUES('PK154028399831472100449597316330', 'component_1', '2019-11-11 19:15:00');
    */

    return Promise.all(queue)
  },
  connection,
  exec
}


/*
let sqlSyntax = 'INSERT INTO anke.performs_tbl(perform_id, project_id, perform_begin_time, perform_end_time) VALUES(0, ?, ?, ?)'
let sqlParams = ['123', '2019-11-11 17:15:00', '2019-11-11 19:15:00']

db.exec(sqlSyntax, sqlParams).then(results => {
	console.log('增：', results)
}).catch(err => {
	console.log(err)
})

sqlSyntax = `SELECT * FROM anke.performs_tbl`

db.exec(sqlSyntax).then(results => {
	console.log('查： ', results)
}).catch(err => {
	console.log(err)
})

sqlSyntax = 'UPDATE anke.performs_tbl SET perform_begin_time = ?, perform_end_time = ? WHERE project_id = ?'
sqlParams = ['2019-11-12 17:15:00', '2019-11-12 19:15:00', '123']

db.exec(sqlSyntax, sqlParams).then(results => {
	console.log('改： ', results)
}).catch(err => {
	console.log(err)
})

sqlSyntax = 'DELETE FROM anke.performs_tbl WHERE project_id = ?'
sqlParams = ['123']

db.exec(sqlSyntax, sqlParams).then(results => {
	console.log('删： ', results)
}).catch(err => {
	console.log(err)
}) */