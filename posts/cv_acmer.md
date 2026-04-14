---
title: 计算机视觉数学原理的C++实现
date: 2026-01-24
tags:
  - 算法
  - 计算机视觉
  - 数学
  - acm
summary: ACMer + CV = ？
---

# ACMer + CV = ？

>我是碎碎念：
>碍于本人实在不擅长记忆各种概念
>以及正好看到傅里叶变换联想到多项式常用的FFT算法~~（死去的记忆开始攻击退役ACMer）~~
>想着计算机视觉无非也就是在二维数组上写大模拟
>于是突发奇想尝试用c++复现计算机视觉最原始的数学方法
>最终留下了这一篇不知道有什么用的小作文……
>
>介于本人`算法`与`计算机视觉水平`都有限，欢迎大佬拷打 (´；ω；｀)

这是智乃，她很可爱OVO
![19b23acde0409a117ca87854403e6dcc](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124000432360-1352851335.jpg)
# 大纲

- 1 C++&计算机视觉？
- 2 傅里叶变换
	- 2.1 傅里叶变换是什么
	- 2.2 ACMer的FFT遗产
- 3 空域与频域
	- 3.1 空域频域hyw……
	- 3.2 获取频谱图
- 4 直方图
	- 4.1 直方图的计算
	- 4.2 直方图均衡化
- 5 空域滤波
	- 5.1 均值滤波
- 6 频域滤波
	- 6.1 理想高通低通滤波
	- 6.2 振铃&布特沃斯函数

# 1 C++&计算机视觉？

>我也是碎碎念：
>用c++来写计算机视觉本身挺招笑的不是吗……

### 为什么要用c++实现计算机视觉？

课程的实验报告只要求学生使用opencv实现，但扪心自问一下cv随便"."两下真的理解了什么东西吗……
用c++实现计算机视觉本身是没什么应用场景的，但我认为对于初学者了解计算机视觉背后原理、学扎实数学基础有重要意义。

### 如何上手

上手c++ CV其实只需要知道下面两点：

1. 计算机视觉本质在做什么？
    c++的二维数组上做遍历
2. 怎么把图片和二维数组相互转换？
    利用[stb_image头文件](https://github.com/nothings/stb.git)

直接把c++代码拿出来，保证大部分ACMer一眼懂了
```c++
#define STB_IMAGE_IMPLEMENTATION
#include "libs/stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "libs/stb_image_write.h"

#include<iostream>
unsigned char* nums;
int width, height, channels;

void solve()
{
    
}

int main() {
    // 利用第三方工具加载图像
    const char* input_path = "tmp3.png";
    const char* origin_path = "origin.jpg";
    const char* output_path = "output.jpg";    
    nums = stbi_load(input_path, &width, &height, &channels, 1);
    if (!nums) 
    {
        std::cerr << "无法读取文件: " << input_path << std::endl;
        return -1;
    }

    solve();
    
    stbi_write_jpg(output_path, width, height, 1, nums, 90);
    std::cout << "处理完成！结果已保存至: " << output_path << std::endl;
    stbi_image_free(nums);
    return 0;
}
```
另外由于本人编程习惯，我的代码有如下宏定义：
```c++
#define inc(i,a,b) for(int i(a);i<=b;i++)
#define dec(i,a,b) for(int i(a);i>=b;i--)
```
# 2 傅里叶变换
## 2.1 傅里叶变换是什么

>基本思想是一个[函数](https://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B0 "函数")可以用（[可数或不可数](https://zh.wikipedia.org/wiki/%E5%8F%AF%E6%95%B0 "可数")，可数的情况对应于[傅里叶级数](https://zh.wikipedia.org/wiki/%E5%82%85%E9%87%8C%E5%8F%B6%E7%BA%A7%E6%95%B0 "傅里叶级数")）无穷多个[周期函数](https://zh.wikipedia.org/wiki/%E5%91%A8%E6%9C%9F%E5%87%BD%E6%95%B0 "周期函数")的[线性组合](https://zh.wikipedia.org/wiki/%E7%BA%BF%E6%80%A7%E7%BB%84%E5%90%88 "线性组合")来[逼近](https://zh.wikipedia.org/wiki/%E9%80%BC%E8%BF%91%E7%90%86%E8%AE%BA)
>
>——wikipedia

我们这里不讨论那么数学化的概念，我们只讨论我们用得到的概念，即ACMer常用在多项式上的那一套。

这里推荐一个我入门FFT的[博客](https://www.cnblogs.com/Charllote/articles/18999028)

### 一维意义上：
给定一个一维实数数组，我们可以把这个数组理解为一个多项式的系数，即：
$$
f(x)=\sum a_ix^i
$$
那么傅里叶变换之后得到的就是一个一维的虚数数组，令$\omega_k=sin(\frac{2\pi k}{n})+cos(\frac{2\pi k}{n})i \quad \text{（i是虚数符号）}$。则输出数组就是
$$
b_k=f(\omega_k)
$$
不过一般为了效率，傅里叶变换会使用分治后的快速傅里叶算法，实际输出的顺序略有不同。

不过我认为理解了是虚数带入多项式数组得到虚数数组就理解的足够了。
### 二维上：

显然二维数组不可以看成一个多项式。

图像是一个 $M \times N$ 的二维信号。二维傅里叶变换（2D DFT）具有**可分离性**。这意味着我们不需要理解二维意义上的傅里叶变换，我们只需要横向做一遍傅里叶变换再纵向做一遍就可以了。

## 2.2 ACMer的FFT遗产

没记错这个板子是直接从oiwiki上偷的
```c++
namespace ACM{
    const double PI = acos(-1);
    std::vector<int> rev;
    void initRev(int lim,int bit)
    {
        rev.assign(lim,0);
        inc(i,0,lim-1)
        {
            rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
        }
    }
    /**
     * 快速傅里叶变换（位逆序置换版）
     * @param a 复数数组
     * @param n 变换长度，为数组长度（必须为2的幂）
     * @param dir 变换方向：1=正向DFT，-1=逆向IDFT
     */
    auto FFT(
        std::complex<double>* a,
        int n,
        int dir
    ){
        inc(i, 0, n-1)if(i < rev[i])swap(a[i],a[rev[i]]);
  
        // 对区间长度从小到大遍历（蝶形运算）
        for(int wid(2); wid <= n; wid <<= 1)
        {
            // 初始化单位根
           std::complex<double>dw(cos(2 * PI / wid), sin(2 * PI / wid) * dir);
            // 枚举区间左端点
            for(int index(0); index < n; index += wid)
            {
                // 初始化旋转因子
                std::complex<double>w(1, 0);
                // 把区间的左右半部分分开处理
                inc(k, index, index + wid / 2 - 1)
                {
                    std::complex<double> x = a[k];
                    std::complex<double> y = a[k+wid/2];
                    a[k]=x+y*w;
                    a[k+wid/2]=x-y*w;
                    // 注意旋转旋转因子
                    w*=dw;
                }
            }
        }
    }
};
```



# 3 空域与频域
## 3.1 空域频域hyw……

空域很好理解，就是原始的灰度图像，即空间意义上的含义。

最简单的理解方式是：**空域滤波是“加权平均”，频域滤波是“多项式点值乘法”**。

这两种方法殊途同归，其背后的数学支撑是**卷积定理**：空域的卷积等于频域的乘法。

事实上频域这个名词本身就来源于傅里叶变换
经过傅里叶变换生成的函数 $\hat{f}$ 称作原函数 $f$ 的傅里叶变换，应用意义上称作[频谱](https://zh.wikipedia.org/wiki/%E9%A2%91%E8%B0%B1 "频谱")。

所以频域其实就是原本二维数组傅里叶变换之后的频谱。
## 3.2 获取频谱图

经过前面的理解，那么频谱图很好理解了，就是傅里叶变换之后的图像。

那如果傅里叶变换得到的数组是虚数数组，那频谱图是怎么把虚数画出来的？

其实频谱图画的是虚数数组的模长，具体的c++实现如下：

```c++
void spectrum(std::string cmd,std::string type,std::vector<double> args) {
    using namespace std;
    cerr<<"识别到指令："<<cmd<<endl;
    // 补零
    int lw = 1, bitw = 0;
    while(lw < width) lw <<= 1, bitw++;
    int lh = 1, bith = 0;
    while(lh < height) lh <<= 1, bith++;
  
    vector<vector<complex<double>>> data(lh, vector<complex<double>>(lw, {0,0}));
    int index(0);
  
    inc(i, 0, height - 1) {
        inc(j, 0, width - 1) {
            data[i][j] = {(double)nums[i * width + j], 0.0};
        }
    }
    // 对输入图像进行2D傅里叶变换
    // 由于傅里叶变换具有离散性质，可以先做纵向再做横向
    ACM::initRev(lw, bitw);
    inc(i, 0, lh - 1) ACM::FFT(data[i].data(), lw, 1);
    ACM::initRev(lh, bith);
    inc(j, 0, lw - 1) {
        vector<complex<double>> col(lh);
        inc(i, 0, lh - 1) col[i] = data[i][j];
        ACM::FFT(col.data(), lh, 1);
        inc(i, 0, lh - 1) data[i][j] = col[i];
    }
  
	cerr<<"正在获取频域图"<<endl;
	// 结果写回原 nums 数组，大小仍按原 width * height 展示中心部分
	double max_val = 0;
	// 动态计算最大值用于归一化
	inc(i, 0, height - 1) {
		inc(j, 0, width - 1) {
			// 中心化：频谱搬移等价于对原始数据乘以 (-1)^(i+j)
			// 这里直接对结果进行坐标平移：(i + lh/2)%lh, (j + lw/2)%lw
			int ni = (i + lh / 2) % lh;
			int nj = (j + lw / 2) % lw;
			double mag = log(1 + abs(data[ni][nj])); // 对数压缩
			if(mag > max_val) max_val = mag;
		}
	}
	inc(i, 0, height - 1) {
		inc(j, 0, width - 1) {
			int ni = (i + lh / 2) % lh;
			int nj = (j + lw / 2) % lw;
			double mag = log(1 + abs(data[ni][nj]));
			nums[i * width + j] = (unsigned char)(mag / max_val * 255);
		}
	}
	return;

}
```

值得一提的是，一般情况下输出的频谱图是经过平移的，具体的平移关系如下：
![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124010100108-1205943116.png)
所以原本数组中对应低频的$data[0][0]$被平移到了频谱图的正中间，最终的频谱图**中间表示低频，四周表示高频**。

最终效果
 <img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124010502975-1447539231.png" width="40%"><img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124010453935-1183993390.png" width="40%">

恭喜你至此已经完成了所有滤波里最费解的部分了。
# 4 直方图
## 4.1 直方图的计算
简单的不得了，直接上代码：
```c++
const int bits(255);
int size(width*height);
vector<int> cnt(256),pre(256),res(256);
inc(i,0,size-1)cnt[nums[i]]++;
```

## 4.2 直方图均衡化
关键是要记住均衡化的公式。
其实均衡化的算法很多，这里我只实现了我课程ppt上的。
核心步骤如下：
1. 获得原直方图前缀数组$pre$
2. 定义函数$f(x)=\lceil \frac{bits\times pre[i]}{size} \rceil$
3. 输出的直方图就是原数组带入函数的结果$cnt[i]=f(cnt[i])$
```c++
inc(i,1,bits)pre[i]=pre[i-1]+cnt[i];
float tmp((float)bits/size);
inc(i,0,bits)res[i]=(tmp*pre[i]+0.5);
inc(i,0,size-1)nums[i]=res[nums[i]];
```
### 附效果图
<img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124015558805-1912566102.png" width=40%>
<img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124015448180-1195685420.png" width=40%>



# 5 空域滤波
## 5.1 均值滤波
> 其实就是遍历一遍二维数组，每个位置用$3\times 3$范围内的灰度加权平均数代替它
```c++
void mean_filtering(int type)
{
    using namespace std;
  
    // 定义卷积核
    int core[3][3][3]{
        {
            {1,1,1},
            {1,1,1},
            {1,1,1}
        },
        {
            {1,1,1},
            {1,2,1},
            {1,1,1}
        },
        {
            {1,2,1},
            {2,4,2},
            {1,2,1}
        }
    };
    double inv_frac[3]{1.0/9.0,1.0/10.0,1/16};
  
    vector<int> res(width*height);
    inc(i,0,height-1)
    {
        inc(j,0,width-1)
        {
            if(!i||!j||i==height-1||j==width-1)
            {
                res[i*width+j]=nums[i*width+j];
                continue;
            }
            inc(ti,i-1,i+1)
            {
			inc(tj,j-1,j+1)
               res[i*width+j]+=nums[ti*width+tj]*core[type][ti-i+1][tj-j+1];
            }
            res[i*width+j]=res[i*width+j]*inv_frac[type];
        }
    }
  
    inc(i,0,width*height-1)nums[i]=res[i];
}
```

>其他的空域滤波只是换了卷积掩膜，步骤重复，不予实现
>频域滤波要用傅里叶变换，有点意思，直接跳到频域操作
### 附效果图
<img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124015558805-1912566102.png" width=40%>
<img src="https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124015729937-1958245633.png" width=40%>


# 6 频域滤波
>我说有意思的来了

高通滤波和低通滤波的核心理念就是：保留频域上高频的部分和保留频域上低频的部分
## 6.1 理想高通低通滤波
理想指的是以$data[0][0]$最低频位置为原点画个圆，低通只保留这个圆，高通只挖这个圆。
值得一提的是由于图像大部分位置都是低频的（灰度变化慢的），所以$data[0][0]$表示图片整体亮度，在高通时注意不要把$data[0][0]$扣掉了。
## 6.2 振铃&布特沃斯函数
在代码中，理想滤波器使用的是一种“非 0 即 1”的阶跃函数。如果你在频域直接切断，在空域图像上就会看到物体的边缘出现了一圈一圈类似水波纹的虚影，这就是**振铃效应**。

从多项式角度看，这其实是因为你在频域做了一个**矩形窗裁剪**。根据卷积定理，频域的矩形函数对应空域的 **Sinc 函数**。Sinc 函数自带那些上下波动的“小尾巴”，它们叠加在像素边缘，就变成了你看到的波纹。
### 6.2.2 布特沃斯函数 (Butterworth)：工程上的妥协
为了消灭振铃，我们需要让频率的过渡变得“丝滑”一点，而不是悬崖式的切断。布特沃斯滤波器提供了一个平滑的传递函数：
- **低通 (BLPF)**: $H(u,v) = \frac{1}{1 + [D(u,v)/D_0]^{2n}}$
- **高通 (BHPF)**: $H(u,v) = \frac{1}{1 + [D_0/D(u,v)]^{2n}}$

这里 $D_0$ 是设定的半径（截止频率），$n$ 是阶数。
**为什么它有效？**
1. **平滑过渡**：当 $D(u,v)$ 靠近 $D_0$ 时，它不是突然变 0，而是平滑地衰减。这在空域中大大削弱了 Sinc 函数的波动。
2. **阶数 $n$ 的魔力**：当 $n=1$ 时，它非常平滑，完全没有振铃；当 $n$ 趋向于无穷大时，它就退化成了你写的“理想滤波器”。通常在工程中，**$n=2$** 是效果与性能的最佳平衡点。

实现代码
```c++
void spectrum(std::string cmd,std::string type,std::vector<double> args) {
    using namespace std;
    cerr<<"识别到指令："<<cmd<<endl;
    // 补零
    int lw = 1, bitw = 0;
    while(lw < width) lw <<= 1, bitw++;
    int lh = 1, bith = 0;
    while(lh < height) lh <<= 1, bith++;
  
    vector<vector<complex<double>>> data(lh, vector<complex<double>>(lw, {0,0}));
    int index(0);
  
    inc(i, 0, height - 1) {
        inc(j, 0, width - 1) {
            data[i][j] = {(double)nums[i * width + j], 0.0};
        }
    }
    // 对输入图像进行2D傅里叶变换
    // 由于傅里叶变换具有离散性质，可以先做纵向再做横向
    ACM::initRev(lw, bitw);
    inc(i, 0, lh - 1) ACM::FFT(data[i].data(), lw, 1);
    ACM::initRev(lh, bith);
    inc(j, 0, lw - 1) {
        vector<complex<double>> col(lh);
        inc(i, 0, lh - 1) col[i] = data[i][j];
        ACM::FFT(col.data(), lh, 1);
        inc(i, 0, lh - 1) data[i][j] = col[i];
    }
  
    // 仅仅是获取频域图
    if(cmd=="get")
    {
        cerr<<"正在获取频域图"<<endl;
        // 结果写回原 nums 数组，大小仍按原 width * height 展示中心部分
        double max_val = 0;
        // 动态计算最大值用于归一化
        inc(i, 0, height - 1) {
            inc(j, 0, width - 1) {
                // 中心化：频谱搬移等价于对原始数据乘以 (-1)^(i+j)
                // 这里直接对结果进行坐标平移：(i + lh/2)%lh, (j + lw/2)%lw
                int ni = (i + lh / 2) % lh;
                int nj = (j + lw / 2) % lw;
                double mag = log(1 + abs(data[ni][nj])); // 对数压缩
                if(mag > max_val) max_val = mag;
            }
        }
        inc(i, 0, height - 1) {
            inc(j, 0, width - 1) {
                int ni = (i + lh / 2) % lh;
                int nj = (j + lw / 2) % lw;
                double mag = log(1 + abs(data[ni][nj]));
                nums[i * width + j] = (unsigned char)(mag / max_val * 255);
            }
        }
        return;
    }
  
    double radius = args.front();
    int n = (args.size()>=2?args[1]:0); // 布特沃斯阶数，通常取2
    if(cmd=="filter")
    inc(i, 0, lh - 1) {
        inc(j, 0, lw - 1) {
            int dy = min(i, lh - i);
            int dx = min(j, lw - j);
            double d = sqrt(dx * dx + dy * dy); // 对应 PPT 中的 D(u,v)
            double h = 1.0; // 传递函数 H(u,v)
  
            if (type == "high") {
                // 理想高通
                if (d < radius) h = 0.0;
            }
            else if (type == "low") {
                // 理想低通
                if (d > radius) h = 0.0;
            }
            else if (type == "bhigh") {
                // 布特沃斯高通：H = 1 / (1 + (D0/D)^(2n))
                if (d == 0) h = 0.0; // 避免除以0
                else h = 1.0 / (1.0 + pow(radius / d, 2 * n));
            }
            else if (type == "blow") {
                // 布特沃斯低通：H = 1 / (1 + (D/D0)^(2n))
                h = 1.0 / (1.0 + pow(d / radius, 2 * n));
            }
  
            data[i][j] *= h; // 应用滤波
        }
    }
  
    // 如果不需要频域图直接用逆向FFT复原
    ACM::initRev(lh, bith);
    inc(j, 0, lw - 1) {
        vector<complex<double>> col(lh);
        inc(i, 0, lh - 1) col[i] = data[i][j];
        ACM::FFT(col.data(), lh, -1);
        inc(i, 0, lh - 1) data[i][j] = col[i];
    }
    ACM::initRev(lw, bitw);
    inc(i, 0, lh - 1) ACM::FFT(data[i].data(), lw, -1);
  
    double size = (double)lw * lh;
    inc(i, 0, height - 1) {
        inc(j, 0, width - 1) {
            // IFFT 结果需要除以 N*M，并取模（或实部）
            // 注意限制值域在(0,255)
            double val = min(max(0.0,abs(data[i][j]) / size),255.0);
            nums[i * width + j] = (unsigned char)(val + 0.5);
        }
    }
}
```

### 最终效果对比

|      | 低通                                                                                                 | 高通                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 理想   | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124013931649-23909045.png)   | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124013851701-976628314.png)  |
| 振铃   | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124013150498-2143250968.png) | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124013618272-1758968026.png) |
| 布特沃斯 | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124014022766-1590618320.png) | ![image](https://img2024.cnblogs.com/blog/3692730/202601/3692730-20260124013958009-761378628.png)  |
