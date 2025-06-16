# ziwei-gt

紫微斗数计算工具库

## 安装

```bash
npm install ziwei-gt
```

## 使用方法

```typescript
import { capitalize, reverse } from 'ziwei-gt';

console.log(capitalize('hello')); // 输出: Hello
console.log(reverse('hello')); // 输出: olleh
```

## 开发

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test
```

### 构建

```bash
npm run build
```

## 发布流程

本项目使用GitHub Actions自动发布到npm。发布新版本的步骤如下：

1. 更新版本号：在`package.json`中更新版本号
2. 提交更改：`git commit -am "bump version to x.x.x"`
3. 创建标签：`git tag vx.x.x`
4. 推送标签：`git push && git push --tags`
5. 在GitHub上创建新的Release，选择刚刚创建的标签

创建Release后，GitHub Actions会自动构建并发布到npm。

## 注意事项

发布前需要在GitHub仓库设置中添加NPM_TOKEN密钥。