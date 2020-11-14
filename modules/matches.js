var matches = []

module.exports.setMatches = (matches) => {
    this.matches = matches
}

module.exports.getMatches = () => {
   return this.matches
}

module.exports.getMatchDetails = (match) => {
    var splitScore = match.Score.split('-')
    homeGoals = parseInt(splitScore[0])
    awayGoals = parseInt(splitScore[1])
    if (homeGoals == NaN) {
        return null
    }
    var a = {
      homeTeamName: match.T1,
      awayTeamName: match.T2,
      homeGoals: homeGoals,
      awayGoals: awayGoals
    }
    return a
  }