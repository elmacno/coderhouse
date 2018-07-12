var express = require('express');
const fs = require('fs');
var router = express.Router();

router.get('/', (req, res) => {
  fs.readdir(__dirname + '/../data/', { encoding: 'utf-8' }, (err, files) => {
    res.json(files.filter((file) => file.endsWith('.json')).map((file) => file.match(/(.*)\.json/)[1]));
  })
});

router.post('/', (req, res) => {
  fs.stat(__dirname + `/../data/${req.params.id}.json`, (err, stat) => {
    if (!err) {
      return res.status(404).json({message: `list ${req.params.id} already exists.`});
    }
    let list = req.body;
    fs.writeFile(__dirname + `/../data/${list.id}.json`, JSON.stringify(list), { encoding: 'utf-8' }, () => {
        res.json({ message: 'Created new list', data: list });
    });
  });
});

router.get('/:id', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    res.json(list);
  });
});

router.put('/:id', (req, res) => {
  fs.stat(__dirname + `/../data/${req.params.id}.json`, (err, stat) => {
    if (err) {
      return res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = req.body;
    fs.writeFile(__dirname + `/../data/${req.params.id}.json`, JSON.stringify(list), { encoding: 'utf-8' }, () => {
        res.json({ message: 'Updated list', data: list });
    });
  });
});

router.delete('/:id', (req, res) => {
  fs.stat(__dirname + `/../data/${req.params.id}.json`, (err, stat) => {
    if (err) {
      return res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    fs.unlink(__dirname + `/../data/${req.params.id}.json`, (err) => {
      if (err) {
        return res.status(500).json({ message: `could not delete list ${req.params.id}`});
      }
      res.json({ message: `Deleted list ${req.params.id}` });
    })
  });
});

router.get('/:id/tasks', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    res.json(list.tasks);
  });
});

router.post('/:id/tasks', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    list.tasks = list.tasks || [];
    list.tasks.push(req.body);
    fs.writeFile(__dirname + `/../data/${req.params.id}.json`, JSON.stringify(list), { encoding: 'utf-8' }, () => {
      res.json({ message: 'Added tasks', data: list });
    })
  });
});


router.get('/:id/tasks/:taskId', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    list.tasks = list.tasks || [];
    res.json(list.tasks);
  });
});

router.put('/:id/tasks/:taskId', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    list.tasks = list.tasks || [];
    let taskUpdated = false;
    list.tasks = list.tasks.map((task) => {
      if (task.id == req.params.taskId) {
        taskUpdated = true;
        return req.body;
      }
      else {
        return task;
      }
    })
    if (!taskUpdated) {
      return res.status(404).json({message: `task ${req.params.taskId} not found in list ${req.params.id}.`});
    }
    fs.writeFile(__dirname + `/../data/${req.params.id}.json`, JSON.stringify(list), { encoding: 'utf-8' }, () => {
      res.json({ message: 'Updated tasks', data: list });
    })
  });
});

router.delete('/:id/tasks/:taskId', (req, res) => {
  let input = fs.readFile(__dirname + `/../data/${req.params.id}.json`, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return res.status(404).json({message: `list ${req.params.id} not found.`});
    }
    let list = JSON.parse(data);
    list.tasks = list.tasks || [];
    let taskUpdated = false;
    list.tasks = list.tasks.filter((task) => {
      if (task.id == req.params.taskId) {
        taskDeleted = true;
        return false;
      } else {
        return true;
      }
    })
    if (!taskDeleted) {
      return res.status(404).json({message: `task ${req.params.taskId} not found in list ${req.params.id}.`});
    }
    fs.writeFile(__dirname + `/../data/${req.params.id}.json`, JSON.stringify(list), { encoding: 'utf-8' }, () => {
      res.json({ message: 'Deleted task', data: list });
    })
  });
});


module.exports = router;
