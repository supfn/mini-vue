# mini-vue

A mini mvvm framework similar to vue


```

new Vue  =>  Observer  =>  Dep ==================
                                               ↓↑
         =>  Compile =>  Directive ========> Watcher 
                             ||                ||
                              ==>   Updater   <==
```
