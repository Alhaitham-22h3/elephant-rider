var StoryData = {
  nodes: {
    "chapter1_node1": {
      id: "chapter1_node1",
      chapter: "第一章：遇见你的象",
      text: "期中成绩出来了。\n\n你盯着手机屏幕上的绩点，那个数字像一盆冷水从头浇下来——比预期低了太多。你明明熬了好几个通宵复习，明明觉得自己考得还行，可结果就是这样不讲道理。\n\n室友小陈从上铺探下头来："怎么样？我3.8，还行吧。"\n\n你把手机扣在桌上，什么也说不出来。胸口涌上一股说不清的闷气，又堵又胀，像有什么东西要炸开。\n\n你盯着桌上那摞厚厚的课本，突然想一把全推到地上。",
      options: [
        { text: "推！就是想推，看着它们就烦", type: "elephant", emotionImpact: 8, nextNodeId: "chapter1_node2a" },
        { text: "深呼吸，告诉自己别跟别人比，冷静下来", type: "rider", emotionImpact: 6, nextNodeId: "chapter1_node2b" },
        { text: "停下来，仔细感受这股闷气——它到底在说什么？", type: "harmony", emotionImpact: 5, nextNodeId: "chapter1_node2c" }
      ]
    },

    "chapter1_node2a": {
      id: "chapter1_node2a",
      chapter: "第一章：遇见你的象",
      text: "课本哗啦啦散了一地，有一本还把水杯碰倒了，水泼了一桌。\n\n那一瞬间，你确实感到了一丝痛快。但紧接着，看着满地的书和湿透的笔记，挫败感不但没消失，反而多了一层懊恼。\n\n你蹲下来捡书，手指翻到一页密密麻麻的笔记——那是你凌晨两点一个字一个字写的。你盯着那些字迹，突然意识到：刚才那个推书的冲动，好像不是"你"——它来得太快、太猛，像是另一个人在替你做决定。\n\n那个"人"根本不在乎你的笔记有多辛苦。",
      options: [
        { text: "心里有些害怕，不知道自己怎么了", type: "elephant", emotionImpact: 5, nextNodeId: "chapter1_node3" },
        { text: "告诉自己只是太累了，睡一觉就好", type: "rider", emotionImpact: 4, nextNodeId: "chapter1_node3" }
      ]
    },

    "chapter1_node2b": {
      id: "chapter1_node2b",
      chapter: "第一章：遇见你的象",
      text: "你用力吸了一口气，又缓缓吐出来。课本还好好摞在桌上，水杯也稳稳当当。\n\n理性告诉你，推书解决不了任何问题。你成功地压住了那股冲动，但那股闷气并没有消失——它只是被你塞进了某个角落，像一头被关在笼子里的野兽，不安地踱步。\n\n你拿起手机刷了会儿朋友圈，表面上恢复了平静，但胸口那种堵堵的感觉还在。你看到同学晒实习offer、晒奖学金，每一条都像一根小刺，扎在你已经够难受的心上。\n\n你隐约觉得，那股被你压下去的力量，并没有真的离开。",
      options: [
        { text: "关掉手机，强迫自己去看下一节课的课件", type: "rider", emotionImpact: 5, nextNodeId: "chapter1_node3" },
        { text: "承认那股闷气还在，试着不去赶走它", type: "harmony", emotionImpact: 4, nextNodeId: "chapter1_node3" }
      ]
    },

    "chapter1_node2c": {
      id: "chapter1_node2c",
      chapter: "第一章：遇见你的象",
      text: "你没有推书，也没有急着让自己冷静。你只是坐在那里，像观察一个陌生人一样观察自己的闷气。\n\n它在哪里？好像在胸口，闷闷的，像一团灰色的雾。\n它想说什么？好像在喊："我已经很努力了！为什么还是不够好！"\n\n你第一次注意到，这股闷气并不是你的敌人——它更像是一个委屈的同伴，在用激烈的方式引起你的注意。就像一头巨大的象，被困在狭小的空间里，不安地甩着鼻子。\n\n它不是在跟你作对，它只是太累了，太想被看见了。",
      options: [
        { text: "对这股闷气说：我听到你了", type: "harmony", emotionImpact: 6, nextNodeId: "chapter1_node3" },
        { text: "虽然有点理解了，但还是想赶紧摆脱它", type: "rider", emotionImpact: 3, nextNodeId: "chapter1_node3" }
      ]
    },

    "chapter1_node3": {
      id: "chapter1_node3",
      chapter: "第一章：遇见你的象",
      text: "下午是小组汇报。\n\n你站在讲台上，PPT翻到第三页，突然脑子一片空白。你看着台下几十双眼睛，嘴巴像被粘住了一样，一个字也说不出来。\n\n沉默持续了大概五秒，但你觉得像过了五分钟。旁边的组员小声提醒你，你才回过神来，磕磕巴巴地讲完了剩下的内容。\n\n走下讲台的那一刻，你的脸烧得发烫。你感到一股热流从胸口直冲上来——那是羞耻，纯粹的、本能的羞耻。你的拳头不自觉地攥紧了。\n\n回到座位上，你只想把自己缩成一个点，消失在教室的角落里。",
      options: [
        { text: "在心里狠狠骂自己：怎么这么丢人！", type: "elephant", emotionImpact: 9, nextNodeId: "chapter1_node4a" },
        { text: "假装什么都没发生，挤出微笑继续听课", type: "rider", emotionImpact: 7, nextNodeId: "chapter1_node4b" },
        { text: "承认自己很尴尬，告诉自己紧张是正常的", type: "harmony", emotionImpact: 5, nextNodeId: "chapter1_node4c" }
      ]
    },

    "chapter1_node4a": {
      id: "chapter1_node4a",
      chapter: "第一章：遇见你的象",
      text: "你在心里把自己骂了一百遍：废物、丢人、别人怎么都没事就你出丑……\n\n下课后，你拒绝了同学一起吃饭的邀请，一个人快步走回宿舍。路上你一直在回放那个画面——脑子空白、嘴巴发僵、台下安静的那五秒。\n\n你想起《象与骑象人》里的话：情感反应的速度远快于理性判断。你的羞耻在你思考之前就已经爆发了，就像一头受惊的象，横冲直撞。\n\n而骑象人——你的理性——只能在事后拼命自责，好像骂自己就能弥补什么。但你越骂，心里越难受，那头象越是不安。",
      options: [
        { text: "懊恼自己总是这样，控制不住情绪", type: "rider", emotionImpact: 4, nextNodeId: "chapter1_node5" },
        { text: "虽然方式不对，但至少说明我很在意", type: "harmony", emotionImpact: 3, nextNodeId: "chapter1_node5" }
      ]
    },

    "chapter1_node4b": {
      id: "chapter1_node4b",
      chapter: "第一章：遇见你的象",
      text: "你听到自己用轻松的语气说"没事没事"，但你的脸还在发烫，手心全是汗。\n\n同学聊起了别的话题，你跟着笑，跟着点头，但那个在讲台上卡住的画面一直在你脑子里循环播放。\n\n你成功地在别人面前维持了体面，但那股羞耻并没有消失——它只是被你按了暂停键，随时可能找到另一个出口。\n\n你想起成绩出来时压下去的闷气。那次你压住了，这次你又压住了。但每一次压制，都像是在给一头大象套上更紧的锁链——它迟早会挣脱。",
      options: [
        { text: "继续忍耐，谁不是这样过来的", type: "rider", emotionImpact: 6, nextNodeId: "chapter1_node5" },
        { text: "意识到压制不是办法，但也不知道该怎么办", type: "harmony", emotionImpact: 4, nextNodeId: "chapter1_node5" }
      ]
    },

    "chapter1_node4c": {
      id: "chapter1_node4c",
      chapter: "第一章：遇见你的象",
      text: "你在心里对自己说：紧张是正常的，谁上台都会紧张。\n\n奇怪的是，当你承认了自己的羞耻，它反而没那么灼人了。你依然觉得尴尬，但你不再被羞耻推着走——你开始能跟它共处了。\n\n下课后，组员小林走过来："你第三页的数据分析讲得挺好的，就是中间停了一下，下次提前多练两遍就好了。"\n\n你愣了一下。原来别人看到的，和你自己感受到的，完全不一样。你一直盯着那五秒的空白，却忘了自己其实讲了二十分钟。\n\n就像骑象人没有试图勒住象，而是轻轻拍了拍它的脖子，告诉它：我知道你紧张，但你其实做得还不错。",
      options: [
        { text: "这种感觉很新奇，想记住它", type: "harmony", emotionImpact: 6, nextNodeId: "chapter1_node5" },
        { text: "虽然好一些了，但心里还是觉得丢人", type: "elephant", emotionImpact: 3, nextNodeId: "chapter1_node5" }
      ]
    },

    "chapter1_node5": {
      id: "chapter1_node5",
      chapter: "第一章：遇见你的象",
      text: "晚上，你一个人在操场散步。秋天的晚风带着凉意，路灯把你的影子拉得很长。\n\n今天发生了太多事。你开始回想——成绩出来时的闷气、想推书的冲动、讲台上脑子空白后的羞耻……这些情绪来得快、来得猛，完全不受你控制。\n\n你想起一个比喻：人的内心就像一头大象和一个骑象人。大象力大无穷，反应迅速，它是你的情绪和本能；骑象人弱小但清醒，他是你的理性和意志。\n\n今天，你第一次清楚地看见了你的"象"。\n\n它不是你的敌人，也不是你的主人。它就是你的一部分——一个强大、敏感、需要被理解的部分。",
      options: [
        { text: "我想学会和这头象相处", type: "harmony", emotionImpact: 7, nextNodeId: "chapter2_node1" },
        { text: "我必须更好地控制它，不能让它再闯祸", type: "rider", emotionImpact: 5, nextNodeId: "chapter2_node1" },
        { text: "它太强了，我有点害怕它", type: "elephant", emotionImpact: 4, nextNodeId: "chapter2_node1" }
      ]
    }
  }
};
