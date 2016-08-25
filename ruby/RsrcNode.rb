class RsrcNode
  def RsrcNode.build_tree(tiles)
    dirs = [
      {:name => :right, :xd => 1, :yd => 0},
      {:name => :up, :xd => 0, :yd => -1},
      {:name => :left, :xd => -1, :yd => 0},
      {:name => :down, :xd => 0, :yd => 1}
    ]

    # lists of tiles that have not been claimed as a neighbor
    dirs.each do |dir|
      dir.a = tiles.dup
    end

    # populate tiles with neighbor pointers and array of border tiles
    border = []
    ntiles = tiles.map do |center|
      border_tile = false
      center.node = RsrcNode.new(center.x, center.y)
      dirs.each do |dir|
        i = dir.a.index do |tile|
          tile.x == center.x + dir.xd && tile.y == center.y + dir.yd
        end
        if i
          center[dir.name] = dir.a.delete_at i
        else
          center[dir.name] = nil
          border_tile = true
          center.node.rank = 0
        end
      end
      border << center if border_tile
    end

    #determine ranks of nodes
    border.each do |tile|
      dirs.each do |dir|
        nbr = tile[dir.name]
        if nbr
          tile.node.adj << nbr.node
          if nbr.node.rank < 0
            nbr.node.rank = tile.node.rank + 1
            border << nbr
          end
        end
      end
    end

    #return highest ranking node
    return border.pop
  end

  def initialize(x, y)
    @x = x
    @y = y
    @adj = []
    @rank = -1
  end
