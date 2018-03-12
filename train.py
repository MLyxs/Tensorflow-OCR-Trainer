from trainer.backend import train

def main():
    train(model_config_file='architectures/CNN_BiRNN_model.json',
          labels_file='/home/kapitan/Desktop/Jerome/words.txt',
          data_dir='/home/kapitan/Desktop/Jerome/words/',
          desired_image_height=176,
          desired_image_width=176,
          test_fraction=0.3,
          num_epochs=160,
          save_checkpoint_epochs=1,
          batch_size=440,
          max_label_length=21,
          charset_file='charsets/chars.txt')


if __name__ == '__main__':
    main()