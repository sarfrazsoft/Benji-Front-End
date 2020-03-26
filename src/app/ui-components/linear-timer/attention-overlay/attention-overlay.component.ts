import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-timer-attention-overlay',
  templateUrl: './attention-overlay.component.html',
  styleUrls: ['./attention-overlay.component.scss']
})
export class AttentionOverlayComponent implements OnInit {
  timerr;
  constructor() {}

  ngOnInit() {
    function Timerr(duration) {
      const self = this;
      this.duration = duration;
      this.running = false;
      this.els = {
        tickerHeight: null,
        secondsTextContent: 0
      };
    }
    Timerr.prototype.start = function() {
      const self = this;
      let start = null;
      this.running = true;
      let remainingSeconds = (this.els.secondsTextContent =
        this.duration / 1000);
      function draw(now) {
        if (!start) {
          start = now;
        }
        const diff = now - start;
        const newSeconds = Math.ceil((self.duration - diff) / 1000);
        if (diff <= self.duration) {
          self.els.tickerHeight = 100 - (diff / self.duration) * 100 + '';
          if (newSeconds !== remainingSeconds) {
            self.els.secondsTextContent = newSeconds;
            remainingSeconds = newSeconds;
          }
          self.frameReq = window.requestAnimationFrame(draw);
        } else {
          self.els.secondsTextContent = 0;
          self.els.tickerHeight = '0';
        }
      }
      self.frameReq = window.requestAnimationFrame(draw);
    };
    Timerr.prototype.reset = function() {
      this.running = false;
      window.cancelAnimationFrame(this.frameReq);
      this.els.secondsTextContent = this.duration / 1000;
      this.els.tickerHeight = null;
    };
    Timerr.prototype.setDuration = function(duration) {
      this.duration = duration;
      this.els.secondsTextContent = this.duration / 1000;
    };

    this.timerr = new Timerr(10000);
    this.timerr.start();
  }

  startAttentionOverlay() {}
}
