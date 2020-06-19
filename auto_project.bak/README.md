#**自动化部署项目**
### 一、第一次部署
    cd conf/sdparm
    sh yum_sdoarn.sh
    cd -
    python start_project.py
    
### 二、N次部署问题
    进行第二次或者N次部署的时候才会有自定义升级配置
    在一次部署的时候没有自定义升级
    原因：
        获取不到大数据配置、无法进行升级
        
    