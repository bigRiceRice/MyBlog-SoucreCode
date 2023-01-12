#!/usr/bin/env sh
 
# 确保脚本抛出遇到的错误
set -e

# 生成打包
yarn build
# 删除原先的打包
rm -rf github.io/dist/*

# 用新的打包文件替换旧的打包文件
cp -rf docs/.vuepress/dist/*  github.io/dist/

# 进入笔记本上线的库（gihub page）
cd github.io

# git 初始化，每次初始化不影响推送
git init
git add -A
git commit -m 'deploy'

git push 