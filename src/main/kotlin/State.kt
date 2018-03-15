enum class State {
    DEAD {
        override fun toString(): String {
            return "D"
        }
    },
    ALIVE {
        override fun toString(): String {
            return "A"
        }
    }
}